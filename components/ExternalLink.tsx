import { Href, Link } from 'expo-router';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={(event) => {
        // Prevent the default behavior of linking to the default browser on native
        event.preventDefault();
        // For mobile, we'll just use the standard Linking API that's built into expo-router
        // No need for explicit expo-web-browser handling
      }}
    />
  );
}
