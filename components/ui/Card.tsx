interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({
    children,
    className = "",
}: CardProps) {

    return (

        <div
            className={`
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-200
                p-6
                transition-all
                duration-300
                hover:shadow-lg
                ${className}
            `}
        >

            {children}

        </div>

    );

}