import { useRouteError } from 'react-router-dom';

interface HttpError extends Error {
  status?: number;
  statusText?: string;
}

export const ErrorFallback: React.FC = () => {
  const error = useRouteError() as HttpError | null;
  console.error(error);

  return (
    <div
      className="flex h-full flex-col items-center justify-center"
      id="error-page"
    >
      <h1 className="mb-10 text-3xl">
        Sorry, an unexpected error has occurred.
      </h1>
      {error && (
        <div className="jus flex flex-col items-start">
          {error.status && <p>Status: {error.status}</p>}
          {error.statusText && <p>Status Text: {error.statusText}</p>}
          {error.message && <p>Message: {error.message}</p>}
        </div>
      )}
    </div>
  );
};
