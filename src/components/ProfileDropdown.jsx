import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, BookMarked, User, LogOut } from 'lucide-react';
import { useAuth } from '../config/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProfileDropdown({ user, isMobile = false, closeMobileMenu = () => {} }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
    if (isMobile) {
      closeMobileMenu();
    }
  };

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];

  if (isMobile) {
    return (
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col items-start gap-4">
        <span className="text-sm font-medium w-full">Olá, {userName}</span>
        <Link to="/meus-dados" className="text-sm text-zinc-700 dark:text-zinc-300 w-full" onClick={closeMobileMenu}>Meus Dados</Link>
        <Link to="/minhas-reservas" className="text-sm text-zinc-700 dark:text-zinc-300 w-full" onClick={closeMobileMenu}>Minhas Reservas</Link>
        <button onClick={handleSignOut} className="text-sm text-red-600 dark:text-red-500 w-full text-left">Sair</button>
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800">
          Olá, {userName}
          <ChevronDown className="-mr-1 h-5 w-5 text-zinc-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => <Link to="/meus-dados" className={classNames(active ? 'bg-zinc-100 dark:bg-zinc-800' : '', 'group flex items-center w-full px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200')}><User className="mr-3 h-5 w-5 text-zinc-400 group-hover:text-zinc-500" aria-hidden="true" />Meus Dados</Link>}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => <Link to="/minhas-reservas" className={classNames(active ? 'bg-zinc-100 dark:bg-zinc-800' : '', 'group flex items-center w-full px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200')}><BookMarked className="mr-3 h-5 w-5 text-zinc-400 group-hover:text-zinc-500" aria-hidden="true" />Minhas Reservas</Link>}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => <button onClick={signOut} className={classNames(active ? 'bg-zinc-100 dark:bg-zinc-800' : '', 'group flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-500')}><LogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" aria-hidden="true" />Sair</button>}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}