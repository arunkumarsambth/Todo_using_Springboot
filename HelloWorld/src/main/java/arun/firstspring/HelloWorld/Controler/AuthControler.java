package arun.firstspring.HelloWorld.Controler;


import arun.firstspring.HelloWorld.Servies.UserServies;
import arun.firstspring.HelloWorld.Utiles.JwtUtil;
import arun.firstspring.HelloWorld.models.User;
import arun.firstspring.HelloWorld.repository.UserRepociter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthControler {

//    @Autowired

    private final UserServies userServies;
    private final UserRepociter userRepociter;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> Register(@RequestBody Map<String,String> body){

        String email=body.get("email");
        String password=body.get("password");
        password=passwordEncoder.encode(password);

        if(userRepociter.findByEmail(email).isPresent()){
            return new ResponseEntity<>("Email already have", HttpStatus.CONFLICT);
        }

        userServies.createUser(User.builder().email(email).password(password).build());
        return new ResponseEntity<>("Success",HttpStatus.CREATED);
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String,String> body){

        String email=body.get("email");
        String password=body.get("password");

        var userOptional= userRepociter.findByEmail(email);

        if(userOptional.isEmpty()){
            return new ResponseEntity<>("Not register or empty",HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password");
        }
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token",token));
    }
}
