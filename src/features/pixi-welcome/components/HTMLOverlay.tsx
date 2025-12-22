import { Box, TextField, InputAdornment, Modal, Paper, Typography, IconButton } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';

interface HTMLOverlayProps {
  studentName: string;
  onNameChange: (name: string) => void;
  activeModal: string | null;
  onCloseModal: () => void;
}

export const HTMLOverlay: React.FC<HTMLOverlayProps> = ({
  studentName,
  onNameChange,
  activeModal,
  onCloseModal,
}) => {
  return (
    <>
      {/* Name Input Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: '-240px', // Adjust based on board layout
          zIndex: 10,
          pointerEvents: 'none', // Let clicks through except on input
        }}
      >
        <TextField
          fullWidth
          placeholder="Enter Your Name"
          value={studentName}
          onChange={(e) => onNameChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999', fontSize: '2rem' }} />
              </InputAdornment>
            ),
            sx: {
              width: '800px',
              bgcolor: 'white',
              borderRadius: '40px',
              fontSize: '1.5rem',
              fontFamily: '"Comic Sans MS", cursive',
              border: '3px solid #D2691E',
              '& fieldset': { border: 'none' },
              py: '16px',
              px: '20px',
              pointerEvents: 'auto', // Enable input interaction
            },
          }}
        />
      </Box>

      {/* Parents Area Modal */}
      {activeModal === 'parents' && (
        <ModalOverlay title="👨‍👩‍👧 Parents Area" onClose={onCloseModal}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Welcome to the Parents Area! Here you can:
          </Typography>
          <ul>
            <li>View your child's progress</li>
            <li>Access teacher resources</li>
            <li>Manage account settings</li>
            <li>Download progress reports</li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            Sign in with your parent account to access these features.
          </Typography>
        </ModalOverlay>
      )}

      {/* Help Modal */}
      {activeModal === 'help' && (
        <ModalOverlay title="❓ Help & Support" onClose={onCloseModal}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            How to Get Started
          </Typography>
          <ol>
            <li>
              <strong>Enter your name</strong> in the text box
            </li>
            <li>
              <strong>Choose your role:</strong> Student or Grown-Up
            </li>
            <li>
              <strong>Click "Start!"</strong> to begin today's challenge
            </li>
          </ol>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Need More Help?
          </Typography>
          <Typography variant="body2">
            Contact us at: <strong>support@readingforest.com</strong>
          </Typography>
        </ModalOverlay>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' || activeModal === 'extra-settings' ? (
        <ModalOverlay title="⚙️ Settings" onClose={onCloseModal}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Display Settings
          </Typography>
          <Box sx={{ mb: 2 }}>
            <label>
              <input type="checkbox" defaultChecked /> Enable sound effects
            </label>
          </Box>
          <Box sx={{ mb: 2 }}>
            <label>
              <input type="checkbox" defaultChecked /> Enable animations
            </label>
          </Box>
          <Box sx={{ mb: 2 }}>
            <label>
              <input type="checkbox" /> Dark mode
            </label>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Accessibility
          </Typography>
          <Box sx={{ mb: 2 }}>
            <label>
              <input type="checkbox" /> High contrast mode
            </label>
          </Box>
          <Box sx={{ mb: 2 }}>
            <label>
              <input type="checkbox" /> Reduce motion
            </label>
          </Box>
        </ModalOverlay>
      ) : null}
    </>
  );
};

// Modal Overlay Component
interface ModalOverlayProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ title, onClose, children }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          position: 'relative',
          maxWidth: 600,
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFACD 100%)',
          border: '6px solid #8B4513',
          borderRadius: 4,
          p: 4,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: '#FF5722',
            color: '#FFF',
            '&:hover': {
              bgcolor: '#F4511E',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            color: '#8B4513',
            fontWeight: 'bold',
            fontFamily: '"Comic Sans MS", cursive',
            mb: 3,
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>

        {/* Content */}
        <Box
          sx={{
            fontFamily: '"Comic Sans MS", cursive',
            fontSize: '1.1rem',
            color: '#333',
          }}
        >
          {children}
        </Box>
      </Paper>
    </Modal>
  );
};
