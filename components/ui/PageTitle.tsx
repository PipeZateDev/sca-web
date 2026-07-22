interface Props {

    title: string;

    subtitle?: string;

}

export default function PageTitle({

    title,

    subtitle,

}: Props) {

    return (

        <div className="mb-8">

            <h1 className="text-2xl font-bold text-[#0B4F8A] sm:text-3xl lg:text-4xl">

                {title}

            </h1>

            {subtitle && (

                <p className="mt-2 text-gray-600">

                    {subtitle}

                </p>

            )}

        </div>

    );

}