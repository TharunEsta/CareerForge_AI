import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CoverLetterGenerator from './components/CoverLetterGenerator';
// ... other imports ...

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* ... other routes ... */}
          <Route path="/" element={<CoverLetterGenerator />} />
          <Route path="/cover-letter" element={<CoverLetterGenerator />} />
          {/* ... other routes ... */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 