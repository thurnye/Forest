import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Student, ReadingLevel } from '@shared/types/api.types';

const editStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  targetGradeLevel: z.nativeEnum(ReadingLevel),
});

type EditStudentFormData = z.infer<typeof editStudentSchema>;

interface EditStudentDialogProps {
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onSave: (studentId: string, data: EditStudentFormData) => Promise<void>;
}

export const EditStudentDialog = ({
  open,
  student,
  onClose,
  onSave,
}: EditStudentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentSchema),
  });

  useEffect(() => {
    if (student && open) {
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        targetGradeLevel: student.targetGradeLevel || ReadingLevel.KINDERGARTEN,
      });
      setError(null);
    }
  }, [student, open, reset]);

  const onSubmit = async (data: EditStudentFormData) => {
    if (!student) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(student.id, data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update student information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Edit Student Information</span>
          <IconButton
            edge='end'
            color='inherit'
            onClick={handleClose}
            aria-label='close'
            disabled={isSubmitting}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component='form' id='edit-student-form' onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin='normal'
            label='First Name'
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Last Name'
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Email'
            type='email'
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isSubmitting}
          />
          <FormControl fullWidth margin='normal' error={!!errors.targetGradeLevel}>
            <InputLabel>Target Grade Level</InputLabel>
            <Select
              {...register('targetGradeLevel')}
              label='Target Grade Level'
              defaultValue={student?.targetGradeLevel || ReadingLevel.KINDERGARTEN}
              disabled={isSubmitting}
            >
              <MenuItem value={ReadingLevel.PRE_K}>Pre-K</MenuItem>
              <MenuItem value={ReadingLevel.KINDERGARTEN}>Kindergarten</MenuItem>
              <MenuItem value={ReadingLevel.GRADE_1}>Grade 1</MenuItem>
              <MenuItem value={ReadingLevel.GRADE_2}>Grade 2</MenuItem>
              <MenuItem value={ReadingLevel.GRADE_3}>Grade 3</MenuItem>
              <MenuItem value={ReadingLevel.GRADE_4}>Grade 4</MenuItem>
              <MenuItem value={ReadingLevel.GRADE_5}>Grade 5</MenuItem>
            </Select>
            {errors.targetGradeLevel && (
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                {errors.targetGradeLevel.message}
              </Box>
            )}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type='submit'
          form='edit-student-form'
          variant='contained'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
