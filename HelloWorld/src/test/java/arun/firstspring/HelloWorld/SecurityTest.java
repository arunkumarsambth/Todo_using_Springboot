package arun.firstspring.HelloWorld;

import arun.firstspring.HelloWorld.Controler.TodoControler;
import arun.firstspring.HelloWorld.Servies.TodoServies;
import arun.firstspring.HelloWorld.Utiles.JwtUtiles;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.context.annotation.Import;

import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TodoControler.class)
@Import({ SecutityConfiguration.class, JwtFilter.class, JwtUtiles.class })
public class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtiles jwtUtiles;


    private TodoServies todoServies;

    @Test
    public void testAccessProtectedResourceWithValidToken() throws Exception {
        // Generate a valid token
        String token = jwtUtiles.generateToken("test@example.com");

        // Try to access a protected resource
        mockMvc.perform(get("/todo")
                .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk());
    }
}
