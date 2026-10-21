import React, { useEffect, useRef, useState } from 'react';
import App from './App';
import TargetCursor from './Component/animations/TargetCursor';
import LoadingScreen from './Component/loading/LoadingScreen';

const AppRoot: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const appContentRef = useRef<HTMLDivElement>(null);

  const dismissLoadingScreen = () => {
    window.dispatchEvent(new Event('litmun:loader-dismissed'));
    setIsLoading(false);
  };

  useEffect(() => {
    if (appContentRef.current) {
      appContentRef.current.inert = isLoading;
    }
  }, [isLoading]);

  useEffect(() => {
    window.dispatchEvent(new Event('litmun:app-ready'));
  }, []);

  return (
    <div className="application-root">
      <TargetCursor
        targetSelector="a, button, [role='button'], input, textarea, select, .cursor-target"
        cursorColor="#d9b56d"
        cursorColorOnTarget="#f2d18a"
      />
      <div ref={appContentRef} aria-hidden={isLoading}>
        <App />
      </div>
      {isLoading && <LoadingScreen onComplete={dismissLoadingScreen} />}
    </div>
  );
};

export default AppRoot;
