import Link from "next/link";

export function Logo({ name, icon: Icon, className, asLink = true }) {
    const content = (
        <>
            {Icon && <Icon className="h-6 w-6" />}
            {name}
        </>
    );

    const baseClasses = `flex items-center gap-2 text-lg font-bold`;

    if (asLink) {
        return (
            <Link href="/dashboard" className={`${baseClasses} ${className || ''}`}>
                {content}
            </Link>
        );
    }

    return (
        <div className={`${baseClasses} ${className || ''}`}>
            {content}
        </div>
    );
} 