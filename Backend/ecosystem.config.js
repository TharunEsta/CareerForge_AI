module.exports = {
  apps: [
    {
      name: 'careerforge-backend',
      script: 'main.py',
      interpreter: 'python3',
      args: '--host 0.0.0.0 --port 8000 --reload',
      cwd: '/home/ubuntu/CareerForge_AI/Backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PYTHONPATH: '/home/ubuntu/CareerForge_AI/Backend'
      },
      error_file: '/home/ubuntu/.pm2/logs/careerforge-backend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/careerforge-backend-out.log',
      log_file: '/home/ubuntu/.pm2/logs/careerforge-backend-combined.log',
      time: true
    }
  ]
}; 