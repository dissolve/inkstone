import {Config} from './config';
import {areEqual} from './utility';

export class Settings {
  static inject() { return [Config]; }


  constructor(Config){
    this.config = Config;

    this.settings = {
      scope: this.config.get('scope'),
      default_post: this.config.get('default_post'),
      default_post_config: this.config.get('default_post_config'),
    }


    this.originalSettings = JSON.parse(JSON.stringify(this.settings));
  }



  canDeactivate() {
    if (!areEqual(this.originalSettings, this.settings)){
      return confirm('You have unsaved changes. Are you sure you wish to leave?');
    }

    return true;
  }

  save() {

    for(var key in this.settings){
        console.log(key);

      this.config.set(key, this.settings[key]);
    }
    this.originalSettings = JSON.parse(JSON.stringify(this.settings));
  }
  revert() {

    this.settings = JSON.parse(JSON.stringify(this.originalSettings));

  }

  reset() {
    this.config.reset();

    this.settings = {
      scope: this.config.get('scope'),
      default_post: this.config.get('default_post'),
      default_post_config: this.config.get('default_post_config'),
    }

    this.originalSettings = JSON.parse(JSON.stringify(this.settings));
  }


  add_list_item(field_name){
    for(var i = 0; i < this.settings.default_post_config.length; i++){
      if(this.settings.default_post_config[i].name == field_name){

        var input_value = this.settings.default_post_config[i].adding_option.trim();

        if( input_value != '' && this.settings.default_post_config[i].type == 'select' ) {

          this.settings.default_post_config[i].options.push(input_value);
          this.settings.default_post_config[i].adding_option = '';

          if(this.settings.default_post_config[i].options.length == 0){
              this.settings.default_post[field_name] = '';//should never happen
          } else {
              //always default to whatever is first in the list
              this.settings.default_post[field_name] = this.settings.default_post_config[i].options[0];
          }
        }
        break;

      }
    }
  }
  

  remove_list_item(field_name, option_val){
      
    for(var i = 0; i < this.settings.default_post_config.length; i++){
      if(this.settings.default_post_config[i].name == field_name){

        if(this.settings.default_post_config[i].type == 'select' ){

          for(var j = 0; j < this.settings.default_post_config[i].options.length; j++){
              if(this.settings.default_post_config[i].options[j] == option_val){

                this.settings.default_post_config[i].options.splice(j, 1);
                break;
              }
          }

          if(this.settings.default_post_config[i].options.length == 0){
              this.settings.default_post[field_name] = '';
          } else {
              //always default to whatever is first in the list
              this.settings.default_post[field_name] = this.settings.default_post_config[i].options[0];
          }
        }
        break;
      }

    }
  }


}
