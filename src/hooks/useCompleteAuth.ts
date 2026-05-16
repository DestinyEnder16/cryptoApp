import { useAppSelector } from '../store/hooks';

export default function useCompleteAuth() {
  const token = useAppSelector((state) => state.auth.token);
}
