package afterady.messages;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LinksSendingMQConfiguration {
    public static final String ACTIVATION_LINKS_QUEUE = "queue1";
    public static final String PASSWORD_RESET_LINKS_QUEUE = "queue2";
    public static final String LINKS_EXCHANGE = "exchange";

    @Bean
    public Queue queue1() {
        return new Queue(ACTIVATION_LINKS_QUEUE, false);
    }

    @Bean
    public Queue queue2() {
        return new Queue(PASSWORD_RESET_LINKS_QUEUE, false);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(LINKS_EXCHANGE);
    }

    @Bean
    public Binding binding1(Queue queue1, TopicExchange exchange) {
        return BindingBuilder.bind(queue1).to(exchange).with("routing.key.1");
    }

    @Bean
    public Binding binding2(Queue queue2, TopicExchange exchange) {
        return BindingBuilder.bind(queue2).to(exchange).with("routing.key.2");
    }

    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    @Bean()
    public MessageConverter jsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        converter.setClassMapper(new DefaultJackson2JavaTypeMapper() {
            @Override
            public void setTrustedPackages(String... trustedPackages) {
                super.setTrustedPackages("afterady");
            }
        });
        return converter;
    }
}
