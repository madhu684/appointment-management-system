export const LoadingSpinner = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="d-flex align-items-center justify-content-center gap-2 py-5 text-muted">
    <div className="spinner-border spinner-border-sm" role="status" />
    <span>{text}</span>
  </div>
);

export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="alert alert-danger d-flex align-items-center gap-2">
    <i className="bi bi-exclamation-triangle-fill" />
    <span>{message}</span>
  </div>
);

export const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-5 text-muted">
    <i className="bi bi-calendar-x fs-1 d-block mb-2 opacity-25" />
    <p className="mb-0">{message}</p>
  </div>
);
