import { navigation } from "@/shared/constants/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { NavItem } from "./NavItem";

type Props = {
    collapsed: boolean;
};

export function NavigationMenu({
    collapsed
}: Props) {

    const role =
        useAuthStore((s) => s.user?.role);

    // Las entradas con `roles` solo se muestran a quien tiene uno de esos
    // roles (espejo del guard del backend: ocultar + proteger).
    const visible = navigation.filter(
        (item) => !item.roles || (role !== undefined && item.roles.includes(role))
    );

    return (

        <nav className="flex flex-col gap-2 px-3">

            {visible.map(({ roles: _roles, ...item }) => (

                <NavItem
                    key={item.href}
                    {...item}
                    collapsed={collapsed}
                />

            ))}

        </nav>

    );

}
