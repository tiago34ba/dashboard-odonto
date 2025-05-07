import { Metric } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((webVitals) => {
      //webVitals.getCLS(onPerfEntry);
      //webVitals.getFID(onPerfEntry); // Removed as 'getFID' does not exist
      //webVitals.getFCP(onPerfEntry);
      //      webVitals.getLCP(onPerfEntry); // Removed as 'getLCP' does not exist
     //webVitals.getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
