package afterady.util;

import afterady.domain.advice.category.AdviceCategory;
import com.fasterxml.jackson.core.JsonGenerator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AdviceCategorySerializerTest {

    @Mock
    private JsonGenerator generator;

    @Test
    public void shouldSerializeAdviceCategory() throws IOException {
        // arrange
        var serializer = new AdviceCategorySerializer();

        // act
        serializer.serialize(AdviceCategory.HOME, generator, null);

        // assert
        verify(generator, times(1)).writeStartObject();
        verify(generator, times(1)).writeFieldName("name");
        verify(generator, times(1)).writeString(AdviceCategory.HOME.name());
        verify(generator, times(1)).writeFieldName("displayName");
        verify(generator, times(1)).writeString(AdviceCategory.HOME.getDisplayName());
        verify(generator, times(1)).writeEndObject();
    }
}