import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  QrCode, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  IndianRupee,
  Shield,
  Zap
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  enabled: boolean;
}

interface PaymentStatus {
  status: 'pending' | 'success' | 'failed' | 'processing';
  message: string;
  payment_id?: string;
  qr_code_url?: string;
  expires_at?: string;
}

interface RazorpayPaymentProps {
  amount: number;
  currency: string;
  user_id: string;
  user_email: string;
  user_name: string;
  description: string;
  plan_id: string;
  billing_cycle: string;
  onSuccess?: (paymentData: any) => void;
  onFailure?: (error: string) => void;
  onClose?: () => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  currency,
  user_id,
  user_email,
  user_name,
  description,
  plan_id,
  billing_cycle,
  onSuccess,
  onFailure,
  onClose
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using UPI apps like Google Pay, PhonePe, Paytm',
      icon: <Smartphone className="w-5 h-5" />,
      features: ['Instant payment', 'QR code available', 'No additional charges'],
      enabled: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay using credit or debit cards',
      icon: <CreditCard className="w-5 h-5" />,
      features: ['Secure 3D authentication', 'EMI options available', 'All major cards accepted'],
      enabled: true
    },
    {
      id: 'net_banking',
      name: 'Net Banking',
      description: 'Pay using your bank\'s net banking',
      icon: <Building2 className="w-5 h-5" />,
      features: ['Direct bank transfer', 'Instant verification', 'All major banks supported'],
      enabled: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallets',
      description: 'Pay using digital wallets like Paytm, PhonePe',
      icon: <Wallet className="w-5 h-5" />,
      features: ['Instant payment', 'Cashback rewards', 'Easy top-up'],
      enabled: true
    },
    {
      id: 'emi',
      name: 'EMI',
      description: 'Pay in easy monthly installments',
      icon: <CreditCard className="w-5 h-5" />,
      features: ['No cost EMI', 'Flexible tenure', 'Instant approval'],
      enabled: true
    }
  ];

  const createPayment = async (regenerating = false) => {
    if (regenerating) setIsRegenerating(true);
    else setIsLoading(true);
    setPaymentStatus(null);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          user_id,
          user_email,
          user_name,
          description,
          plan_id,
          billing_cycle,
          payment_method: selectedMethod
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentUrl(data.payment_url);
        setPaymentStatus({
          status: 'pending',
          message: 'Payment initiated successfully',
          payment_id: data.payment_id,
          qr_code_url: data.qr_code_url,
          expires_at: data.expires_at
        });

        if (selectedMethod === 'upi' && data.qr_code_url) {
          setShowQRCode(true);
        }

        // Start countdown timer
        if (data.expires_at) {
          const expiresAt = new Date(data.expires_at).getTime();
          const now = new Date().getTime();
          const timeLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
          setTimeLeft(timeLeft);
        }

        // Poll for payment status
        pollPaymentStatus(data.payment_id);
      } else {
        throw new Error(data.error || 'Payment creation failed');
      }
    } catch (error) {
      setPaymentStatus({
        status: 'failed',
        message: error instanceof Error ? error.message : 'Payment creation failed'
      });
      onFailure?.(error instanceof Error ? error.message : 'Payment creation failed');
    } finally {
      if (regenerating) setIsRegenerating(false);
      else setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (paymentId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/status/${paymentId}`);
        const data = await response.json();

        if (data.success) {
          const status = data.payment_status.status;
          
          if (status === 'captured' || status === 'paid') {
            setPaymentStatus({
              status: 'success',
              message: 'Payment completed successfully!'
            });
            clearInterval(pollInterval);
            onSuccess?.(data.payment_status);
          } else if (status === 'failed') {
            setPaymentStatus({
              status: 'failed',
              message: 'Payment failed. Please try again.'
            });
            clearInterval(pollInterval);
            onFailure?.('Payment failed');
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 10 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 600000);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (paymentStatus && paymentStatus.status === 'pending') {
      // QR code expired, auto-regenerate
      createPayment(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (paymentStatus?.status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'processing':
        return <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <IndianRupee className="w-6 h-6" />
            Secure Payment
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
              <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                  {paymentMethods.map((method) => (
                    <TabsTrigger
                      key={method.id}
                      value={method.id}
                      disabled={!method.enabled}
                      className="flex items-center gap-2"
                    >
                      {method.icon}
                      {method.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {paymentMethods.map((method) => (
                  <TabsContent key={method.id} value={method.id}>
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {method.icon}
                          {method.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 mb-4">{method.description}</p>
                        <div className="space-y-2">
                          {method.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Payment Summary */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-semibold">{description}</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing Cycle:</span>
                  <span className="font-semibold">{billing_cycle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">₹{amount}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Status */}
          <div className="space-y-6">
            {!paymentStatus ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        Your payment is secured with bank-level encryption. We use Razorpay for secure payment processing.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      onClick={() => createPayment()} 
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Pay ₹{amount}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon()}
                    Payment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-2">{paymentStatus.message}</p>
                      {paymentStatus.payment_id && (
                        <Badge variant="outline" className="text-xs">
                          ID: {paymentStatus.payment_id}
                        </Badge>
                      )}
                    </div>

                    {paymentStatus.status === 'pending' && (
                      <>
                        {timeLeft > 0 && (
                          <div className="text-center">
                            <p className="text-sm text-gray-400 mb-2">Time remaining to complete payment:</p>
                            <p className="text-2xl font-mono font-bold text-yellow-500">
                              {formatTime(timeLeft)}
                            </p>
                            <Progress value={(timeLeft / 3600) * 100} className="mt-2" />
                          </div>
                        )}

                        {paymentStatus.qr_code_url && showQRCode && (
                          <div className="text-center">
                            <p className="text-sm text-gray-400 mb-2">Scan QR code with UPI app:</p>
                            <img 
                              src={paymentStatus.qr_code_url} 
                              alt="Payment QR Code"
                              className="mx-auto w-48 h-48 border border-gray-600 rounded-lg"
                            />
                            <div className="mt-2 flex flex-col gap-2 items-center">
                              <Button 
                                variant="outline" 
                                onClick={() => createPayment(true)}
                                disabled={isRegenerating}
                              >
                                {isRegenerating ? 'Regenerating...' : 'Regenerate QR Code'}
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Button 
                            onClick={() => window.open(paymentUrl, '_blank')}
                            className="w-full"
                          >
                            Open Payment Page
                          </Button>
                        </div>
                      </>
                    )}

                    {paymentStatus.status === 'success' && (
                      <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <p className="text-green-500 font-semibold">Payment Successful!</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Your subscription has been activated. You'll receive a confirmation email shortly.
                        </p>
                      </div>
                    )}

                    {paymentStatus.status === 'failed' && (
                      <div className="text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-red-500 font-semibold">Payment Failed</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Please try again with a different payment method.
                        </p>
                        <Button 
                          onClick={() => setPaymentStatus(null)}
                          className="mt-4"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayPayment; 