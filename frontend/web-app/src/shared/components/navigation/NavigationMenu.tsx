import { navigation } from "@/shared/constants/navigation";
import { NavItem } from "./NavItem";

type Props = {
    collapsed: boolean;
};

export function NavigationMenu({
    collapsed
}: Props) {

    return (

        <nav className="flex flex-col gap-2 px-3">

            {navigation.map(item => (

                <NavItem
                    key={item.href}
                    {...item}
                    collapsed={collapsed}
                />

            ))}

        </nav>

    );

}