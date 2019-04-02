import { notification } from 'antd';

let success = (e, opts) => notification.success({ message: '成功', description: e, ...opts });
let error = (e, opts) => notification.error({ message: '错误', description: e, ...opts });
let info = (e, opts) => notification.info({ message: '提醒', description: e, ...opts });
let warning = (e, opts) => notification.warning({ message: '警告', description: e, ...opts });
let warn = (e, opts) => notification.warn({ message: '警告', description: e, ...opts });
let destroy = () => notification.destroy();

export { success, error, info, warning, warn, destroy };
