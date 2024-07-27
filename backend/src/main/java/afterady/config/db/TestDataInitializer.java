package afterady.config.db;

import afterady.domain.advice.Advice;
import afterady.domain.repository.AdviceRepository;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import static afterady.domain.advice.AdviceCategory.*;

@Component
public class TestDataInitializer {
    private final AdviceRepository adviceRepository;

    public TestDataInitializer(AdviceRepository adviceRepository) {
        this.adviceRepository = adviceRepository;
    }

    @EventListener(ApplicationStartedEvent.class)
    public void onApplicationEvent() {
        adviceRepository.deleteAll();
        adviceRepository.save(new Advice("1", "Jak zarządzać czasem", PERSONAL_DEVELOPMENT, "Planowanie dnia jest kluczem do skutecznego zarządzania czasem. Ustal priorytety i trzymaj się planu."));
        adviceRepository.save(new Advice("2", "Organizacja przestrzeni w domu", HOME, "Używaj koszyków i pojemników do przechowywania rzeczy, aby utrzymać porządek w domu."));
        adviceRepository.save(new Advice("3", "Zdrowa dieta", HEALTH, "Zachowaj zrównoważoną dietę bogatą w warzywa, owoce, białko i zdrowe tłuszcze, aby utrzymać zdrowie."));
        adviceRepository.save(new Advice("4", "Oszczędzanie pieniędzy", FINANCE, "Stwórz budżet domowy i trzymaj się go, aby kontrolować swoje wydatki i oszczędzać pieniądze."));
        adviceRepository.save(new Advice("5", "Bezpieczeństwo w sieci", TECHNOLOGY, "Używaj silnych haseł i regularnie je zmieniaj, aby chronić swoje dane online."));
        adviceRepository.save(new Advice("6", "Skuteczne uczenie się", PERSONAL_DEVELOPMENT, "Ucz się w krótkich, intensywnych sesjach i rób regularne przerwy, aby poprawić efektywność nauki."));
        adviceRepository.save(new Advice("7", "Dekorowanie wnętrz", HOME, "Dodaj rośliny do wnętrza, aby ożywić przestrzeń i poprawić jakość powietrza."));
        adviceRepository.save(new Advice("8", "Ćwiczenia fizyczne", HEALTH, "Regularne ćwiczenia fizyczne pomagają w utrzymaniu dobrej kondycji i zdrowia psychicznego."));
        adviceRepository.save(new Advice("9", "Inwestowanie na giełdzie", FINANCE, "Zrób dokładny research przed zainwestowaniem i dywersyfikuj swoje inwestycje, aby zmniejszyć ryzyko."));
        adviceRepository.save(new Advice("10", "Optymalizacja komputera", TECHNOLOGY, "Regularnie aktualizuj oprogramowanie i usuwaj zbędne pliki, aby utrzymać komputer w dobrej kondycji."));
        adviceRepository.save(new Advice("11", "Motywacja do działania", PERSONAL_DEVELOPMENT, "Wyznaczaj sobie małe, osiągalne cele, aby utrzymać motywację do działania."));
        adviceRepository.save(new Advice("12", "Oszczędzanie energii w domu", HOME, "Wyłączaj urządzenia, których nie używasz, i zamień tradycyjne żarówki na LED, aby oszczędzać energię."));
        adviceRepository.save(new Advice("13", "Medytacja", HEALTH, "Codzienna medytacja pomaga zredukować stres i poprawić ogólne samopoczucie."));
        adviceRepository.save(new Advice("14", "Planowanie emerytury", FINANCE, "Regularnie odkładaj część swoich dochodów na konto emerytalne, aby zapewnić sobie spokojną przyszłość."));
        adviceRepository.save(new Advice("15", "Zarządzanie hasłami", TECHNOLOGY, "Używaj menedżera haseł, aby przechowywać i zarządzać swoimi hasłami w bezpieczny sposób."));
        adviceRepository.save(new Advice("16", "Samorozwój przez czytanie", PERSONAL_DEVELOPMENT, "Czytaj codziennie, aby poszerzać swoją wiedzę i rozwijać umiejętności."));
        adviceRepository.save(new Advice("17", "Porządek w szafie", HOME, "Regularnie przeglądaj swoją szafę i pozbywaj się ubrań, których już nie nosisz."));
        adviceRepository.save(new Advice("18", "Higiena snu", HEALTH, "Utrzymuj regularny harmonogram snu i unikaj ekranów przed snem, aby poprawić jakość snu."));
        adviceRepository.save(new Advice("19", "Podstawy budżetowania", FINANCE, "Śledź swoje dochody i wydatki, aby lepiej zarządzać swoimi finansami."));
        adviceRepository.save(new Advice("20", "Bezpieczne korzystanie z internetu", TECHNOLOGY, "Unikaj klikania na podejrzane linki i zawsze sprawdzaj źródła informacji, aby uniknąć oszustw."));
        adviceRepository.save(new Advice("21", "Ustalanie celów", PERSONAL_DEVELOPMENT, "Ustalaj konkretne, mierzalne i osiągalne cele, aby skuteczniej dążyć do sukcesu."));
        adviceRepository.save(new Advice("22", "Sprzątanie kuchni", HOME, "Codziennie czyść blaty kuchenne i regularnie przeglądaj lodówkę, aby utrzymać porządek."));
        adviceRepository.save(new Advice("23", "Regularne badania lekarskie", HEALTH, "Regularne wizyty u lekarza pomagają w wczesnym wykrywaniu i leczeniu chorób."));
        adviceRepository.save(new Advice("24", "Zarządzanie długiem", FINANCE, "Spłacaj swoje długi na czas i unikaj zaciągania nowych zobowiązań, aby utrzymać zdrowe finanse."));
        adviceRepository.save(new Advice("25", "Zabezpieczanie urządzeń", TECHNOLOGY, "Zainstaluj oprogramowanie antywirusowe i regularnie aktualizuj swoje urządzenia, aby chronić je przed zagrożeniami."));
        adviceRepository.save(new Advice("26", "Zarządzanie stresem", PERSONAL_DEVELOPMENT, "Używaj technik relaksacyjnych, takich jak głębokie oddychanie czy joga, aby zarządzać stresem."));
        adviceRepository.save(new Advice("27", "Planowanie posiłków", HOME, "Planuj posiłki na cały tydzień i rób zakupy z listą, aby zaoszczędzić czas i pieniądze."));
        adviceRepository.save(new Advice("28", "Zdrowy tryb życia", HEALTH, "Dbaj o zrównoważoną dietę, regularne ćwiczenia i odpowiednią ilość snu, aby utrzymać zdrowie."));
        adviceRepository.save(new Advice("29", "Inwestowanie w nieruchomości", FINANCE, "Zrób dokładny research rynku i wybieraj nieruchomości o dobrym potencjale wzrostu, aby inwestować z sukcesem."));
        adviceRepository.save(new Advice("30", "Optymalizacja sieci domowej", TECHNOLOGY, "Regularnie aktualizuj firmware swojego routera i używaj silnych haseł, aby zabezpieczyć swoją sieć domową."));
    }
}
