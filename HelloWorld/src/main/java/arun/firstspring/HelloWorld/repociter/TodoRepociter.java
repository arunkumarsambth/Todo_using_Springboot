package arun.firstspring.HelloWorld.repociter;


//import arun.firstspring.HelloWorld.models.Todo;
//import org.springframework.data.mongodb.repository.MongoRepository;
import arun.firstspring.HelloWorld.models.Todo;
//import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
//import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TodoRepociter extends JpaRepository<Todo, Long> {


}
