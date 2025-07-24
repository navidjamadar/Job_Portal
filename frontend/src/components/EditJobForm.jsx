import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddJobForm from './AddJobForm';

const API_BASE = 'http://localhost:5000/api';

function EditJobForm() {
  const { jobId } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt');
        const res = await fetch(`${API_BASE}/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch job');
        setInitialValues({
          title: data.title,
          description: data.description,
          companyName: data.companyName,
          location: data.location,
          salaryMin: data.salaryRange?.min || '',
          salaryMax: data.salaryRange?.max || '',
          type: data.type
        });
      } catch (err) {
        setInitialValues(null);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  const handleEdit = async (form, { setError, setSuccess, setShowToast }) => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${API_BASE}/job/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          companyName: form.companyName,
          location: form.location,
          salaryRange: { min: Number(form.salaryMin), max: Number(form.salaryMax) },
          type: form.type
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Job update failed');
      setSuccess('Job updated!');
      setShowToast(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.message);
      setShowToast(true);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (!initialValues) return <div className="alert alert-danger mt-5">Failed to load job details.</div>;
  return <AddJobForm initialValues={initialValues} onSubmit={handleEdit} isEdit={true} />;
}

export default EditJobForm; 