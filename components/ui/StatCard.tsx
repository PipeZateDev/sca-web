import Card from "./Card";
import { LucideIcon } from "lucide-react";

interface Props {

    title: string;

    value: number | string;

    icon: LucideIcon;

    color?: string;

}

export default function StatCard({

    title,

    value,

    icon: Icon,

    color = "#0B4F8A",

}: Props) {

    return (

        <Card>

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-gray-500">

                        {title}

                    </p>

                    <h3 className="text-4xl font-bold mt-2">

                        {value}

                    </h3>

                </div>

                <div

                    className="rounded-full p-4"

                    style={{

                        backgroundColor: `${color}20`,

                    }}

                >

                    <Icon

                        size={32}

                        color={color}

                    />

                </div>

            </div>

        </Card>

    );

}