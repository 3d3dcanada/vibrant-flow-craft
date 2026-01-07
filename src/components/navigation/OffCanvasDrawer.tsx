import { cn } from "@/lib/utils";
import { X, BookOpen, ShoppingBag, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useCallback } from "react";

interface DrawerItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    description: string;
}

const drawerItems: DrawerItem[] = [
    {
        icon: <BookOpen className="w-5 h-5" />,
        label: "Blog",
        href: "/blog",
        description: "News, tutorials, and maker stories"
    },
    {
        icon: <ShoppingBag className="w-5 h-5" />,
        label: "Store",
        href: "/store",
        description: "Filament, accessories, and more"
    },
    {
        icon: <HelpCircle className="w-5 h-5" />,
        label: "Support",
        href: "/support",
        description: "Help center and contact us"
    },
    {
        icon: <MessageCircle className="w-5 h-5" />,
        label: "Discord",
        href: "https://discord.gg/3d3d",
        description: "Join our maker community"
    },
];

interface OffCanvasDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

export function OffCanvasDrawer({ isOpen, onClose, title = "Menu", children }: OffCanvasDrawerProps) {
    // Handle escape key
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="drawer-overlay"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer Content */}
            <div
                className="drawer-content p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 id="drawer-title" className="font-tech font-bold text-xl text-foreground">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            "text-muted-foreground hover:text-secondary hover:bg-secondary/10",
                            "transition-all duration-200"
                        )}
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Custom Content or Default Menu */}
                {children || (
                    <div className="space-y-2">
                        {drawerItems.map((item) => {
                            const isExternal = item.href.startsWith("http");
                            const Component = isExternal ? "a" : Link;
                            const linkProps = isExternal
                                ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                                : { to: item.href };

                            return (
                                <Component
                                    key={item.label}
                                    {...linkProps as any}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-start gap-4 p-4 rounded-lg",
                                        "glass-panel hover:border-secondary/40",
                                        "transition-all duration-200 group"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-tech font-semibold text-foreground group-hover:text-secondary">
                                            {item.label}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </Component>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
