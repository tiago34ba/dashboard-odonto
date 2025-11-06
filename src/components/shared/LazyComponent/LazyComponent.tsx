import React, { lazy, Suspense, useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}

const LazyContainer = styled.div`
  min-height: 100px;
  width: 100%;
`;

const DefaultFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #dee2e6;
  color: #6c757d;
  font-size: 14px;
`;

const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, hasLoaded]);

  const defaultFallback = (
    <DefaultFallback>
      Carregando componente...
    </DefaultFallback>
  );

  return (
    <LazyContainer ref={containerRef}>
      {isVisible ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </LazyContainer>
  );
};

// Hook para lazy loading de dados
export const useLazyData = <T,>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (loading || data) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, loadData };
};

// Componente de lista virtual para grandes datasets
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

const VirtualListContainer = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  overflow-y: auto;
  position: relative;
`;

const VirtualListContent = styled.div<{ totalHeight: number }>`
  height: ${props => props.totalHeight}px;
  position: relative;
`;

const VirtualListItem = styled.div<{ top: number; height: number }>`
  position: absolute;
  top: ${props => props.top}px;
  height: ${props => props.height}px;
  width: 100%;
`;

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      item: items[i],
      index: i,
      top: i * itemHeight
    });
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <VirtualListContainer height={containerHeight} onScroll={handleScroll}>
      <VirtualListContent totalHeight={totalHeight}>
        {visibleItems.map(({ item, index, top }) => (
          <VirtualListItem key={index} top={top} height={itemHeight}>
            {renderItem(item, index)}
          </VirtualListItem>
        ))}
      </VirtualListContent>
    </VirtualListContainer>
  );
}

export default LazyComponent;