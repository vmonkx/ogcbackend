import React, { useState } from 'react';
import { Button } from '@strapi/design-system';
import { unstable_useContentManagerContext as useContentManagerContext, useNotification } from '@strapi/strapi/admin';

const SyncPricesButton = () => {
  const context = useContentManagerContext();
  const { toggleNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  // Fallback to safe check if slug is available
  if (!context || context.slug !== 'api::service.service') {
    return null;
  }

  const handleSync = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/services/sync-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Sync failed');
      }
      
      const data = await response.json();
      
      toggleNotification({
        type: 'success',
        message: `Успешно: создано ${data.data.created}, обновлено ${data.data.updated}, ошибок ${data.data.errors}`
      });
    } catch (error) {
      console.error(error);
      toggleNotification({
        type: 'danger',
        message: 'Ошибка при синхронизации прайс-листов'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="secondary" 
      onClick={handleSync}
      loading={isLoading}
    >
      Синхронизировать прайсы
    </Button>
  );
};

export default SyncPricesButton;
