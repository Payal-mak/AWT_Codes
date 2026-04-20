import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FormField, Input, Button, AlertBanner } from '../../shared/components/FormComponents';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched', defaultValues: { role: 'student' } });

  const passwordValue = watch('password', '');

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await registerUser({ ...data, role: selectedRole });
      navigate('/books', { replace: true });
    } catch (err) {
      setServerError(err.message);
    }
  };

  const roles = [
    {
      value: 'student',
      label: 'Student',
      description: 'Browse and borrow books',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      value: 'librarian',
      label: 'Librarian',
      description: 'Manage books and inventory',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join LibraryMS today</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <AlertBanner message={serverError} onDismiss={() => setServerError(null)} />
          {serverError && <div className="mb-4" />}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Role Selection */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">I am a…</p>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    id={`role-${r.value}`}
                    onClick={() => setSelectedRole(r.value)}
                    className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all duration-150
                      ${selectedRole === r.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <span className={selectedRole === r.value ? 'text-indigo-600' : 'text-gray-400'}>
                      {r.icon}
                    </span>
                    <span className={`text-sm font-semibold ${selectedRole === r.value ? 'text-indigo-700' : 'text-gray-700'}`}>
                      {r.label}
                    </span>
                    <span className="text-xs text-gray-400">{r.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <FormField label="Full name" id="name" error={errors.name?.message}>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 60, message: 'Name is too long' },
                })}
              />
            </FormField>

            {/* Email */}
            <FormField label="Email address" id="reg-email" error={errors.email?.message}>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
            </FormField>

            {/* Password */}
            <FormField label="Password" id="reg-password" error={errors.password?.message}>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="pr-10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'At least 8 characters required' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Include uppercase, lowercase, and a number',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              {/* Password strength bar */}
              {passwordValue.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[
                    passwordValue.length >= 8,
                    /[A-Z]/.test(passwordValue),
                    /[0-9]/.test(passwordValue),
                  ].map((ok, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${ok ? 'bg-indigo-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              )}
            </FormField>

            {/* Confirm Password */}
            <FormField label="Confirm password" id="confirmPassword" error={errors.confirmPassword?.message}>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === passwordValue || 'Passwords do not match',
                })}
              />
            </FormField>

            <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
