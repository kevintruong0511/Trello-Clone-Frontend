import { useAppSelector } from "../redux/hooks";

export const usePermission = () => {
  const user = useAppSelector((s) => s.auth.user);
  const can = (permission: string) => user?.permissions.includes(permission) ?? false;
  return {
    can,
    canAny: (...permissions: string[]) => permissions.some(can),
    hasRole: (role: string) => user?.roles.includes(role) ?? false,
  };
};
