interface Props {

    title: string;

    children: React.ReactNode;

}

export default function Section({

    title,

    children,

}: Props) {

    return (

        <section className="mt-10">

            <h2 className="text-xl font-semibold mb-4 text-gray-700">

                {title}

            </h2>

            {children}

        </section>

    );

}