import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@strapi/design-system';
import {
  useNotification,
  useFetchClient,
  useRBAC,
} from '@strapi/strapi/admin';

const SYNC_MODELS = new Set(['api::service.service', 'api::price.price']);
const SYNC_PERMISSIONS = [{ action: 'admin::services.sync-prices', subject: null }];

const SyncPricesButton = () => {
  const { slug } = useParams();
  const { post } = useFetchClient();
  const { allowedActions, isLoading: isCheckingPermissions } = useRBAC(SYNC_PERMISSIONS);
  const { toggleNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  if (
    !SYNC_MODELS.has(slug) ||
    isCheckingPermissions || !allowedActions.canSyncPrices
  ) {
    return null;
  }

  const handleSync = async () => {
    try {
      setIsLoading(true);
      const { data } = await post('/admin/services/sync-prices', {});

      toggleNotification({
        type: 'success',
        message: `Успешно: создано ${data.data.created}, обновлено ${data.data.updated}, ошибок ${data.data.errors}`
      });
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: error.status === 409
          ? 'Синхронизация прайс-листов уже выполняется'
          : 'Ошибка при синхронизации прайс-листов'
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
      disabled={isLoading}
    >
      Синхронизировать прайсы
    </Button>
  );
};

export default SyncPricesButton;
