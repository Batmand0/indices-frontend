import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import PropTypes from 'prop-types';

const ProtectedContent = ({ perms, groups, alt, children }) => {
  const [user, isLoggedIn] = useAuthStore((state) => [
    state.userData,
    state.isLoggedIn,
  ]);

  const userGroups = useMemo(() => {
    if (user?.groups?.length) {
      return user.groups.map((g) => g.name);
    }
    return [];
  }, [user]);

  const userPerms = useMemo(() => {
    if (user?.perms?.length) {
      return user.perms;
    }
    return [];
  }, [user]);

  let showContent = false;

  if (!isLoggedIn()) {
    return <Navigate to="/iniciar-sesion" />;
  }

  if (user?.is_superuser) {
    showContent = true;
  } else {
    showContent = userGroups.some((group) => groups?.includes(group));

    if (!showContent) {
      showContent = userPerms.some((perm) => perms?.includes(perm));
    }
  }

  return (
    showContent ? <>{children}</> : <>{alt}</>
  );
};

ProtectedContent.propTypes = {
  perms: PropTypes.arrayOf(PropTypes.string),
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  alt: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedContent;
