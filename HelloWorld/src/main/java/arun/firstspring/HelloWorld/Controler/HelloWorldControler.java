package arun.firstspring.HelloWorld.Controler;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class HelloWorldControler {

    @GetMapping("/hello")
    String Message() {
        return "Hello";
    }
}