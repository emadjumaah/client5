import { useTemplate } from '../../hooks';
import { GeneralLanding } from './landpages';
import CarLanding from './landpages/CarLanding';

export default function Landing(props: any) {
  const { words, isRTL, user, theme, menuitem, company } = props;

  const { tempwords, templateId } = useTemplate();

  if (templateId === 9 || templateId === 4) {
    return (
      <CarLanding
        menuitem={menuitem}
        isRTL={isRTL}
        words={words}
        user={user}
        theme={theme}
        company={company}
        templateId={templateId}
        tempwords={tempwords}
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
