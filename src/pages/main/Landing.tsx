import { useTemplate } from '../../hooks';
import { DeliveryLanding, GeneralLanding } from './landpages';

export default function Landing(props: any) {
  const { words, isRTL, user, theme, menuitem } = props;

  const { templateId } = useTemplate();

  if (templateId === 9) {
    return (
      <DeliveryLanding
        menuitem={menuitem}
        isRTL={isRTL}
        words={words}
        user={user}
        theme={theme}
      ></DeliveryLanding>
    );
  } else {
    return (
      <GeneralLanding
        menuitem={menuitem}
        isRTL={isRTL}
        words={words}
        user={user}
        theme={theme}
      ></GeneralLanding>
    );
  }
}
