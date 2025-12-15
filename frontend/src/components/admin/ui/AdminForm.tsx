'use client';

import { ReactNode, FormEvent } from 'react';
import { Save, X, AlertCircle, CheckCircle } from 'lucide-react';

interface AdminFormProps {
  title?: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isDirty?: boolean;
  errors?: Record<string, string>;
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
  className?: string;
  layout?: 'default' | 'modal' | 'inline';
  successMessage?: string;
  showSuccess?: boolean;
}

export default function AdminForm({
  title,
  description,
  children,
  onSubmit,
  onCancel,
  isLoading = false,
  isDirty = false,
  errors = {},
  submitText = 'Save Changes',
  cancelText = 'Cancel',
  showCancel = true,
  className = '',
  layout = 'default',
  successMessage = 'Changes saved successfully!',
  showSuccess = false
}: AdminFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  const hasErrors = Object.keys(errors).length > 0;

  const formClasses = {
    default: 'max-w-4xl mx-auto',
    modal: 'w-full',
    inline: 'w-full'
  };

  const cardClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700',
    modal: 'bg-transparent',
    inline: 'bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600'
  };

  return (
    <div className={`${formClasses[layout]} ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {layout !== 'modal' && (
          <div className={cardClasses[layout]}>
            {/* Header */}
            {(title || description) && (
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="px-6 py-3 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    {successMessage}
                  </span>
                </div>
              </div>
            )}

            {/* Error Summary */}
            {hasErrors && (
              <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Please fix the following errors:
                    </h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-400">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="px-6 py-6">
              {children}
            </div>
          </div>
        )}

        {layout === 'modal' && (
          <>
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    {successMessage}
                  </span>
                </div>
              </div>
            )}

            {/* Error Summary */}
            {hasErrors && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Please fix the following errors:
                    </h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-400">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="space-y-6">
              {children}
            </div>
          </>
        )}

        {/* Form Actions */}
        <div className={`
          flex items-center justify-between
          ${layout === 'default' 
            ? 'px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 rounded-b-lg' 
            : layout === 'modal'
              ? 'pt-6 border-t border-gray-200 dark:border-gray-600'
              : 'px-6 py-4 bg-gray-100 dark:bg-gray-600 border-t border-gray-200 dark:border-gray-500 rounded-b-lg'
          }
        `}>
          
          {/* Left side - Status indicators */}
          <div className="flex items-center space-x-4">
            {isDirty && !isLoading && (
              <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                Unsaved changes
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                Saving...
              </div>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            {showCancel && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                {cancelText}
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading || hasErrors}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {submitText}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Form Section Component for organizing form fields
export function FormSection({ 
  title, 
  description, 
  children, 
  className = '' 
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

// Form Field Group Component for related fields
export function FormFieldGroup({ 
  children, 
  columns = 1,
  className = '' 
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
      {children}
    </div>
  );
}   