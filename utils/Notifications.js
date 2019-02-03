import { notification } from 'antd';

export default class NotificationService {
  static success({ message, description }) {
    notification.success({ message, description });
  }

  static error({ description }) {
    notification.error({ message: 'error', description });
  }
}
