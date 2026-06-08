import * as Icons from 'lucide-react';

export default function DynamicIcon({ name, ...props }) {
    // Format the name slightly in case of whitespace, but expect PascalCase
    const iconName = name?.trim();
    const IconComponent = Icons[iconName] || Icons.Check;
    return <IconComponent {...props} />;
}
