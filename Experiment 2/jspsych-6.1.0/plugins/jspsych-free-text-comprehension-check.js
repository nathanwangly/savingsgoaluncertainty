/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['free-text-comprehension-check'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'free-text-comprehension-check',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to response'
          },
          placeholder: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            default: "",
            description: 'Placeholder text in the textfield.'
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Rows',
            default: 1,
            description: 'The number of rows for the response text box.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            default: 40,
            description: 'The number of columns for the response text box.'
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Require a response'
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          },
          minAmt: {
            type: jsPsych.plugins.parameterType.INTEGER,
            pretty_name: 'Minimum Response Value',
            default: false,
            description: 'Minimum integer allowed as a response'
          },
          maxAmt: {
            type: jsPsych.plugins.parameterType.INTEGER,
            pretty_name: 'Maximum Response Value',
            default: false,
            description: 'Maximum integer allowed as a response'
          }
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      },
      topleft: {
        type:jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Top left',
        default: false,
        description: 'The text that appears on the top left corner of the screen.'
      },
      topright: {
        type:jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Top right',
        default: false,
        description: 'The text that appears on the top right corner of the screen.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // Set default question parameters -- size and default value
    if (typeof trial.questions[0].rows == 'undefined') {
      trial.questions[0].rows = 1;
    }

    if (typeof trial.questions[0].columns == 'undefined') {
      trial.questions[0].columns = 40;
    }

    if (typeof trial.questions[0].value == 'undefined') {
      trial.questions[0].value = "";
    }

    var html = '';

    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-text-preamble" class="jspsych-survey-text-preamble">'+trial.preamble+'</div>';
    }
    // start form
    html += '<form id="jspsych-survey-text-form">'

    // add question
    var question = trial.questions[0];
    html += '<div id="jspsych-survey-text" class="jspsych-survey-text-question" style="margin: 2em 0em;">';
    html += '<p class="jspsych-survey-text">' + question.prompt + '</p>';
    var req = question.required ? "required" : "";
    html += `<input type="number" min="0" max="${savings}" id="input"  name="#jspsych-survey-text-response" data-name="`+question.name+'" class="inputbox" '+req+' placeholder="'+question.placeholder+'"></input>';
    html += '</div>'

    // add submit button
    html += '<input type="submit" id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text" value="'+trial.button_label+'"></input>';
    html += '</form>'

    display_element.innerHTML = html;



    display_element.querySelector('#jspsych-survey-text-form').addEventListener('submit', function(e) {
      e.preventDefault();
      // measure response time
      var endTime = performance.now();
      var response_time = endTime - startTime;

      // create object to hold responses
      var q_element = document.querySelector('#jspsych-survey-text').querySelector('textarea, input');
      var val = q_element.value;

      response = parseInt(val)
      score += conversion(response)
      savings += -response

      // save data
      var trialdata = {
        "rt": response_time,
        "responses": response
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = performance.now();

    setupUpdater()

  };

  return plugin;
})();
