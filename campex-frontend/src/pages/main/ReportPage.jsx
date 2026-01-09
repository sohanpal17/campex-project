import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { REPORT_TYPES } from '@/constants';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import Button from '@/components/common/Button';
import Textarea from '@/components/common/Textarea';
import { reportService } from '@/services/report.service';

const ReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { product, user } = location.state || {};

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await reportService.createReport({
        ...data,
        reportedProductId: product?.id,
        reportedUserId: user?.id
      });
      handleSuccess('Report submitted successfully');
      navigate(-1);
    } catch (error) {
      handleError(error, 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Report</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Reason for Report <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {REPORT_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      value={type.value}
                      {...register('reportType', { required: 'Please select a reason' })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
              {errors.reportType && (
                <p className="mt-1 text-sm text-red-600">{errors.reportType.message}</p>
              )}
            </div>

            {/* Description */}
            <Textarea
              label="Additional Details (Optional)"
              rows={5}
              placeholder="Please provide any additional information..."
              maxLength={500}
              showCount
              value={watch('description') || ''}
              {...register('description')}
            />

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="danger" loading={isSubmitting} className="flex-1">
                Submit Report
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;