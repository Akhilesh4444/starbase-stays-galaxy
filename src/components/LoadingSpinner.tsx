interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'scale-75',
    md: 'scale-100',
    lg: 'scale-125'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className={`ufo-loader ${sizeClasses[size]}`} />
      <p className="text-muted-foreground font-space text-center animate-pulse">
        {message}
      </p>
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce alien-pulse"></div>
        <div className="w-2 h-2 bg-accent rounded-full animate-bounce alien-pulse" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-alien-green rounded-full animate-bounce alien-pulse" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;