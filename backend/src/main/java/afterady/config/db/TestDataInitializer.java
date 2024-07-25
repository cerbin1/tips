package afterady.config.db;

import afterady.domain.advice.Advice;
import afterady.domain.repository.AdviceRepository;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class TestDataInitializer {
    private final AdviceRepository adviceRepository;

    public TestDataInitializer(AdviceRepository adviceRepository) {
        this.adviceRepository = adviceRepository;
    }

    @EventListener(ApplicationStartedEvent.class)
    public void onApplicationEvent() {
        adviceRepository.deleteAll();
        adviceRepository.save(new Advice("1", "Jak zarządzać czasem", "Rozwój osobisty", "Planowanie dnia jest kluczem do skutecznego zarządzania czasem. Ustal priorytety i trzymaj się planu."));
        adviceRepository.save(new Advice("2", "Organizacja przestrzeni w domu", "Dom", "Używaj koszyków i pojemników do przechowywania rzeczy, aby utrzymać porządek w domu."));
        adviceRepository.save(new Advice("3", "Zdrowa dieta", "Zdrowie", "Zachowaj zrównoważoną dietę bogatą w warzywa, owoce, białko i zdrowe tłuszcze, aby utrzymać zdrowie."));
        adviceRepository.save(new Advice("4", "Oszczędzanie pieniędzy", "Finanse", "Stwórz budżet domowy i trzymaj się go, aby kontrolować swoje wydatki i oszczędzać pieniądze."));
        adviceRepository.save(new Advice("5", "Bezpieczeństwo w sieci", "Technologia", "Używaj silnych haseł i regularnie je zmieniaj, aby chronić swoje dane online."));
        adviceRepository.save(new Advice("6", "Skuteczne uczenie się", "Rozwój osobisty", "Ucz się w krótkich, intensywnych sesjach i rób regularne przerwy, aby poprawić efektywność nauki."));
        adviceRepository.save(new Advice("7", "Dekorowanie wnętrz", "Dom", "Dodaj rośliny do wnętrza, aby ożywić przestrzeń i poprawić jakość powietrza."));
        adviceRepository.save(new Advice("8", "Ćwiczenia fizyczne", "Zdrowie", "Regularne ćwiczenia fizyczne pomagają w utrzymaniu dobrej kondycji i zdrowia psychicznego."));
        adviceRepository.save(new Advice("9", "Inwestowanie na giełdzie", "Finanse", "Zrób dokładny research przed zainwestowaniem i dywersyfikuj swoje inwestycje, aby zmniejszyć ryzyko."));
        adviceRepository.save(new Advice("10", "Optymalizacja komputera", "Technologia", "Regularnie aktualizuj oprogramowanie i usuwaj zbędne pliki, aby utrzymać komputer w dobrej kondycji."));
        adviceRepository.save(new Advice("11", "Motywacja do działania", "Rozwój osobisty", "Wyznaczaj sobie małe, osiągalne cele, aby utrzymać motywację do działania."));
        adviceRepository.save(new Advice("12", "Oszczędzanie energii w domu", "Dom", "Wyłączaj urządzenia, których nie używasz, i zamień tradycyjne żarówki na LED, aby oszczędzać energię."));
        adviceRepository.save(new Advice("13", "Medytacja", "Zdrowie", "Codzienna medytacja pomaga zredukować stres i poprawić ogólne samopoczucie."));
        adviceRepository.save(new Advice("14", "Planowanie emerytury", "Finanse", "Regularnie odkładaj część swoich dochodów na konto emerytalne, aby zapewnić sobie spokojną przyszłość."));
        adviceRepository.save(new Advice("15", "Zarządzanie hasłami", "Technologia", "Używaj menedżera haseł, aby przechowywać i zarządzać swoimi hasłami w bezpieczny sposób."));
        adviceRepository.save(new Advice("16", "Samorozwój przez czytanie", "Rozwój osobisty", "Czytaj codziennie, aby poszerzać swoją wiedzę i rozwijać umiejętności."));
        adviceRepository.save(new Advice("17", "Porządek w szafie", "Dom", "Regularnie przeglądaj swoją szafę i pozbywaj się ubrań, których już nie nosisz."));
        adviceRepository.save(new Advice("18", "Higiena snu", "Zdrowie", "Utrzymuj regularny harmonogram snu i unikaj ekranów przed snem, aby poprawić jakość snu."));
        adviceRepository.save(new Advice("19", "Podstawy budżetowania", "Finanse", "Śledź swoje dochody i wydatki, aby lepiej zarządzać swoimi finansami."));
        adviceRepository.save(new Advice("20", "Bezpieczne korzystanie z internetu", "Technologia", "Unikaj klikania na podejrzane linki i zawsze sprawdzaj źródła informacji, aby uniknąć oszustw."));
        adviceRepository.save(new Advice("21", "Ustalanie celów", "Rozwój osobisty", "Ustalaj konkretne, mierzalne i osiągalne cele, aby skuteczniej dążyć do sukcesu."));
        adviceRepository.save(new Advice("22", "Sprzątanie kuchni", "Dom", "Codziennie czyść blaty kuchenne i regularnie przeglądaj lodówkę, aby utrzymać porządek."));
        adviceRepository.save(new Advice("23", "Regularne badania lekarskie", "Zdrowie", "Regularne wizyty u lekarza pomagają w wczesnym wykrywaniu i leczeniu chorób."));
        adviceRepository.save(new Advice("24", "Zarządzanie długiem", "Finanse", "Spłacaj swoje długi na czas i unikaj zaciągania nowych zobowiązań, aby utrzymać zdrowe finanse."));
        adviceRepository.save(new Advice("25", "Zabezpieczanie urządzeń", "Technologia", "Zainstaluj oprogramowanie antywirusowe i regularnie aktualizuj swoje urządzenia, aby chronić je przed zagrożeniami."));
        adviceRepository.save(new Advice("26", "Zarządzanie stresem", "Rozwój osobisty", "Używaj technik relaksacyjnych, takich jak głębokie oddychanie czy joga, aby zarządzać stresem."));
        adviceRepository.save(new Advice("27", "Planowanie posiłków", "Dom", "Planuj posiłki na cały tydzień i rób zakupy z listą, aby zaoszczędzić czas i pieniądze."));
        adviceRepository.save(new Advice("28", "Zdrowy tryb życia", "Zdrowie", "Dbaj o zrównoważoną dietę, regularne ćwiczenia i odpowiednią ilość snu, aby utrzymać zdrowie."));
        adviceRepository.save(new Advice("29", "Inwestowanie w nieruchomości", "Finanse", "Zrób dokładny research rynku i wybieraj nieruchomości o dobrym potencjale wzrostu, aby inwestować z sukcesem."));
        adviceRepository.save(new Advice("30", "Optymalizacja sieci domowej", "Technologia", "Regularnie aktualizuj firmware swojego routera i używaj silnych haseł, aby zabezpieczyć swoją sieć domową."));
    }
}
