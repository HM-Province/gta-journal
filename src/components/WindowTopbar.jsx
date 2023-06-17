import Icon from '@mdi/react';
import React from 'react';
import { mdiClose, mdiChevronDown } from '@mdi/js';

export default function WindowTopbar() {
  function hideWindow() {
    window.electronAPI.hideWindow();
  }

  function closeWindow() {
    window.electronAPI.closeWindow();
  }

  return <>
    <header className="fixed w-12 top-0 left-0 py-1 surface-hover flex align-items-center justify-content-between" style={{ backdropFilter: 'blur(40px)', WebkitAppRegion: 'drag', zIndex: 9999 }}>
      <span className="font-bold text-xl ml-2">GTA Journal</span>
      <div className="flex align-items-center mr-2" style={{ WebkitAppRegion: 'none' }}>
        <Icon onClick={hideWindow} className="cursor-pointer" path={mdiChevronDown} size={1} />
        <Icon onClick={closeWindow} className="cursor-pointer" path={mdiClose} size={1} />
      </div>
    </header>
  </>
}