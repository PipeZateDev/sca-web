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

            <h1 className="text-4xl font-bold text-[#0B4F8A]">

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