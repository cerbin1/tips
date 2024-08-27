package afterady.util;

import afterady.domain.advice.category.AdviceCategory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class AdviceCategorySerializer extends StdSerializer<AdviceCategory> {
    public AdviceCategorySerializer() {
        super(AdviceCategory.class);
    }

    @Override
    public void serialize(AdviceCategory category, JsonGenerator generator, SerializerProvider provider) throws IOException {
        generator.writeStartObject();
        generator.writeFieldName("name");
        generator.writeString(category.name());
        generator.writeFieldName("displayName");
        generator.writeString(category.getDisplayName());
        generator.writeEndObject();
    }
}
