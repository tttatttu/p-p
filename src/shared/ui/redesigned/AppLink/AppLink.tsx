import { LinkProps, NavLink } from 'react-router-dom';
import { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './AppLink.module.scss';

export type AppLinkVariant = 'primary' | 'red';

interface AppLinkProps extends LinkProps {
  className?: string;
  variant?: AppLinkVariant;
  children?: ReactNode;
  activeClassName?: string;
}

export const AppLink = memo(
  ({
    to,
    className,
    children,
    variant = 'primary',
    activeClassName = '',
    ...otherProps
  }: AppLinkProps) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          classNames(cls.AppLink, { [activeClassName]: isActive }, [
            className,
            cls[variant],
          ])
        }
        {...otherProps}
      >
        {children}
      </NavLink>
    );
  },
);
