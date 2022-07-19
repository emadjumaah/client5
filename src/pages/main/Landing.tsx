import { useTemplate } from '../../hooks';
import { DeliveryLanding, GeneralLanding } from './landpages';
import CarLanding from './landpages/CarLanding';

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
  }
  if (templateId === 4) {
    return (
      <CarLanding
        menuitem={menuitem}
        isRTL={isRTL}
        words={words}
        user={user}
        theme={theme}
      ></CarLanding>
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
