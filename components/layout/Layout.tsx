import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LocalContextMenu, ContextMenuItem } from "./LocalContextMenu";
import { usePageContext } from "../../hooks/usePageContext";

export interface LayoutProps {
  children: React.ReactNode;
  contextMenu?: {
    title?: string;
    subtitle?: string;
    items: ContextMenuItem[];
  };
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  contextMenu: customContextMenu,
}) => {
  const { contextMenu: autoContextMenu } = usePageContext();
  const contextMenu = customContextMenu || autoContextMenu;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {contextMenu && (
          <LocalContextMenu
            title={contextMenu.title}
            subtitle={contextMenu.subtitle}
            items={contextMenu.items}
          />
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
