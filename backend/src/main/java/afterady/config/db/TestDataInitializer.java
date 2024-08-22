package afterady.config.db;

import afterady.domain.advice.Advice;
import afterady.domain.advice.CategoriesStatistics;
import afterady.domain.repository.AdviceRepository;
import afterady.domain.repository.CategoriesStatisticsRepository;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static afterady.domain.advice.AdviceCategory.*;

@Component
public class TestDataInitializer {
    private final AdviceRepository adviceRepository;
    private final CategoriesStatisticsRepository categoriesStatisticsRepository;

    public TestDataInitializer(AdviceRepository adviceRepository, CategoriesStatisticsRepository categoriesStatisticsRepository) {
        this.adviceRepository = adviceRepository;
        this.categoriesStatisticsRepository = categoriesStatisticsRepository;
    }

    @EventListener(ApplicationStartedEvent.class)
    public void onApplicationEvent() {
        adviceRepository.deleteAll();
        adviceRepository.save(new Advice(UUID.fromString("51caeed3-868d-4aa3-9050-c94199639b97"), "Jak zarządzać czasem", PERSONAL_DEVELOPMENT, "Planowanie dnia jest kluczem do skutecznego zarządzania czasem. Ustal priorytety i trzymaj się planu.", rating(1)));
        adviceRepository.save(new Advice(UUID.fromString("d3a6d750-1403-4d9e-a622-6965bc096a72"), "Organizacja przestrzeni w domu", HOME, "Używaj koszyków i pojemników do przechowywania rzeczy, aby utrzymać porządek w domu.", rating(2)));
        adviceRepository.save(new Advice(UUID.fromString("2565579e-983f-463a-9d83-c29f6b81264d"), "Zdrowa dieta", HEALTH, "Zachowaj zrównoważoną dietę bogatą w warzywa, owoce, białko i zdrowe tłuszcze, aby utrzymać zdrowie.", rating(3)));
        adviceRepository.save(new Advice(UUID.fromString("f318a98b-9c28-4d37-b4a7-8a18332ad9cc"), "Oszczędzanie pieniędzy", FINANCE, "Stwórz budżet domowy i trzymaj się go, aby kontrolować swoje wydatki i oszczędzać pieniądze.", rating(4)));
        adviceRepository.save(new Advice(UUID.fromString("aa1c2bd8-1899-4b27-9928-d6bad46826a6"), "Bezpieczeństwo w sieci", TECHNOLOGY, "Używaj silnych haseł i regularnie je zmieniaj, aby chronić swoje dane online.", rating(5)));
        adviceRepository.save(new Advice(UUID.fromString("e252d11d-7f73-47c8-9ccb-f461e7cc1654"), "Skuteczne uczenie się", PERSONAL_DEVELOPMENT, "Ucz się w krótkich, intensywnych sesjach i rób regularne przerwy, aby poprawić efektywność nauki.", rating(6)));
        adviceRepository.save(new Advice(UUID.fromString("da685f9d-3194-48c8-9342-caf7872ebdd9"), "Dekorowanie wnętrz", HOME, "Dodaj rośliny do wnętrza, aby ożywić przestrzeń i poprawić jakość powietrza.", rating(7)));
        adviceRepository.save(new Advice(UUID.fromString("c7b88a68-a7c5-439e-be7b-4473a7c7024d"), "Ćwiczenia fizyczne", HEALTH, "Regularne ćwiczenia fizyczne pomagają w utrzymaniu dobrej kondycji i zdrowia psychicznego.", rating(8)));
        adviceRepository.save(new Advice(UUID.fromString("92f7595b-9657-420b-9be4-09de24073494"), "Inwestowanie na giełdzie", FINANCE, "Zrób dokładny research przed zainwestowaniem i dywersyfikuj swoje inwestycje, aby zmniejszyć ryzyko.", rating(9)));
        adviceRepository.save(new Advice(UUID.fromString("54a875ad-9d23-4f56-9ed2-c6a1594e1870"), "Optymalizacja komputera", TECHNOLOGY, "Regularnie aktualizuj oprogramowanie i usuwaj zbędne pliki, aby utrzymać komputer w dobrej kondycji.", rating(10)));
        adviceRepository.save(new Advice(UUID.fromString("dedc81ca-e05d-42b7-afa8-5d060f9786bc"), "Motywacja do działania", PERSONAL_DEVELOPMENT, "Wyznaczaj sobie małe, osiągalne cele, aby utrzymać motywację do działania.", rating(11)));
        adviceRepository.save(new Advice(UUID.fromString("32b984ec-cf2b-428e-ac75-77435b99ff68"), "Oszczędzanie energii w domu", HOME, "Wyłączaj urządzenia, których nie używasz, i zamień tradycyjne żarówki na LED, aby oszczędzać energię.", rating(12)));
        adviceRepository.save(new Advice(UUID.fromString("afd01a41-cb45-439d-bb89-dbd39cc56cc7"), "Medytacja", HEALTH, "Codzienna medytacja pomaga zredukować stres i poprawić ogólne samopoczucie.", rating(13)));
        adviceRepository.save(new Advice(UUID.fromString("71fbd8a3-051c-42b5-99c9-635b7c5c10f7"), "Planowanie emerytury", FINANCE, "Regularnie odkładaj część swoich dochodów na konto emerytalne, aby zapewnić sobie spokojną przyszłość.", rating(14)));
        adviceRepository.save(new Advice(UUID.fromString("eb5b74e9-d9b0-4a04-9e9d-8db75fb18e55"), "Zarządzanie hasłami", TECHNOLOGY, "Używaj menedżera haseł, aby przechowywać i zarządzać swoimi hasłami w bezpieczny sposób.", rating(15)));
        adviceRepository.save(new Advice(UUID.fromString("fbf602f8-8630-4ba9-b4a9-867af6dbcfda"), "Samorozwój przez czytanie", PERSONAL_DEVELOPMENT, "Czytaj codziennie, aby poszerzać swoją wiedzę i rozwijać umiejętności.", rating(16)));
        adviceRepository.save(new Advice(UUID.fromString("24fc10a1-b050-457b-9120-0e7e730554be"), "Porządek w szafie", HOME, "Regularnie przeglądaj swoją szafę i pozbywaj się ubrań, których już nie nosisz.", rating(17)));
        adviceRepository.save(new Advice(UUID.fromString("8b0621d7-ab9b-4540-bb9e-ecb8b15a1bba"), "Higiena snu", HEALTH, "Utrzymuj regularny harmonogram snu i unikaj ekranów przed snem, aby poprawić jakość snu.", rating(18)));
        adviceRepository.save(new Advice(UUID.fromString("c2953cc3-5b53-45a4-8734-ad74cedc3584"), "Podstawy budżetowania", FINANCE, "Śledź swoje dochody i wydatki, aby lepiej zarządzać swoimi finansami.", rating(19)));
        adviceRepository.save(new Advice(UUID.fromString("a8ed745c-54c5-4da2-af4b-16ab0e6ffacf"), "Bezpieczne korzystanie z internetu", TECHNOLOGY, "Unikaj klikania na podejrzane linki i zawsze sprawdzaj źródła informacji, aby uniknąć oszustw.", rating(20)));
        adviceRepository.save(new Advice(UUID.fromString("a7765a54-e065-4d5a-a5d4-06f0833a8fb7"), "Ustalanie celów", PERSONAL_DEVELOPMENT, "Ustalaj konkretne, mierzalne i osiągalne cele, aby skuteczniej dążyć do sukcesu.", rating(21)));
        adviceRepository.save(new Advice(UUID.fromString("bdcdbdf3-daf6-4c37-912b-c93e7732e4a5"), "Sprzątanie kuchni", HOME, "Codziennie czyść blaty kuchenne i regularnie przeglądaj lodówkę, aby utrzymać porządek.", rating(22)));
        adviceRepository.save(new Advice(UUID.fromString("8be0526c-3f1c-4c6b-8f05-83e025ca25d4"), "Regularne badania lekarskie", HEALTH, "Regularne wizyty u lekarza pomagają w wczesnym wykrywaniu i leczeniu chorób.", rating(23)));
        adviceRepository.save(new Advice(UUID.fromString("a35420ff-ba88-45f9-87b4-cba9fb00ed23"), "Zarządzanie długiem", FINANCE, "Spłacaj swoje długi na czas i unikaj zaciągania nowych zobowiązań, aby utrzymać zdrowe finanse.", rating(24)));
        adviceRepository.save(new Advice(UUID.fromString("b810fe1a-c12b-4bd9-a539-71ceb7ec95b9"), "Zabezpieczanie urządzeń", TECHNOLOGY, "Zainstaluj oprogramowanie antywirusowe i regularnie aktualizuj swoje urządzenia, aby chronić je przed zagrożeniami.", rating(25)));
        adviceRepository.save(new Advice(UUID.fromString("b20cf9fe-bead-4ea5-b72d-2ef95f0c190c"), "Zarządzanie stresem", PERSONAL_DEVELOPMENT, "Używaj technik relaksacyjnych, takich jak głębokie oddychanie czy joga, aby zarządzać stresem.", rating(26)));
        adviceRepository.save(new Advice(UUID.fromString("028359c0-d49b-4cd8-bad3-db606aa7afe5"), "Planowanie posiłków", HOME, "Planuj posiłki na cały tydzień i rób zakupy z listą, aby zaoszczędzić czas i pieniądze.", rating(27)));
        adviceRepository.save(new Advice(UUID.fromString("5aad06f9-55d7-4973-871f-58a14f5b2878"), "Zdrowy tryb życia", HEALTH, "Dbaj o zrównoważoną dietę, regularne ćwiczenia i odpowiednią ilość snu, aby utrzymać zdrowie.", rating(28)));
        adviceRepository.save(new Advice(UUID.fromString("1708bacf-c252-4585-b93a-e072ed8bf888"), "Inwestowanie w nieruchomości", FINANCE, "Zrób dokładny research rynku i wybieraj nieruchomości o dobrym potencjale wzrostu, aby inwestować z sukcesem.", rating(29)));
        adviceRepository.save(new Advice(UUID.fromString("f7bc3be3-b9ee-47b9-90ed-4d04d0f37fc8"), "Optymalizacja sieci domowej", TECHNOLOGY, "Regularnie aktualizuj firmware swojego routera i używaj silnych haseł, aby zabezpieczyć swoją sieć domową.", rating(30)));

        categoriesStatisticsRepository.save(new CategoriesStatistics(UUID.fromString("b5b4fa0e-cb88-48f3-bee2-4e07cda16b6c"), HOME, HOME.getDisplayName(), "Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.", 6));
        categoriesStatisticsRepository.save(new CategoriesStatistics(UUID.fromString("84e0fee2-a16c-4e38-a101-8db21661f897"), PERSONAL_DEVELOPMENT, PERSONAL_DEVELOPMENT.getDisplayName(), "Porady dotyczące samorozwoju i motywacji.", 6));
        categoriesStatisticsRepository.save(new CategoriesStatistics(UUID.fromString("cfa81cc4-6d9b-4c81-a340-7b9b7fd119e4"), HEALTH, HEALTH.getDisplayName(), "Porady dotyczące zdrowia i dobrego samopoczucia.", 6));
        categoriesStatisticsRepository.save(new CategoriesStatistics(UUID.fromString("c80d0e5b-dc1b-40db-a19c-7a4090e3fe10"), FINANCE, FINANCE.getDisplayName(), "Porady dotyczące zarządzania finansami.", 6));
        categoriesStatisticsRepository.save(new CategoriesStatistics(UUID.fromString("9d039671-7bc9-4d8c-aef3-05aa6a737517"), TECHNOLOGY, TECHNOLOGY.getDisplayName(), "Porady dotyczące nowinek technologicznych.", 6));
    }

    private Set<String> rating(int value) {
        Set<String> test = new HashSet<>(value);
        for (int i = 0; i < value; i++) {
            test.add(String.format("test%s@test.pl", i));
        }
        return test;
    }
}
