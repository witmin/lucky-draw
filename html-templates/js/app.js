/** @jsx React.DOM */

var Todo = Backbone.Model.extend({
  // Default attributes for the todo
  // and ensure that each todo created has `title` and `completed` keys.
  defaults: {
    title: '',
    completed: false
  },

  // Toggle the `completed` state of this todo item.
  toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }
});

var TodoList = Backbone.Collection.extend({

  // Reference to this collection's model.
  model: Todo,

  // Save all of the todo items under the `"todos"` namespace.
  localStorage: new Store('todos-react-backbone'),

  // Filter down the list of all todo items that are finished.
  completed: function() {
    return this.filter(function( todo ) {
      return todo.get('completed');
    });
  },

  remaining: function() {
    return this.without.apply(this, this.completed());
  },

  // We keep the Todos in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder: function () {
    if (!this.length) {
      return 1;
    }
    return this.last().get('order') + 1;
  },

  // Todos are sorted by their original insertion order.
  comparator: function (todo) {
    return todo.get('order');
  }
});

var Utils = {
  pluralize: function( count, word ) {
    return count === 1 ? word : word + 's';
  },

  stringifyObjKeys: function(obj) {
    var s = '';
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      if (obj[key]) {
        s += key + ' ';
      }
    }
    return s;
  }
};

// Begin React stuff

var TodoItem = React.createClass({
  handleSubmit: function(event) {
    var val = this.refs.editField.getDOMNode().value.trim();
    if (val) {
      this.props.onSave(val);
    } else {
      this.props.onDestroy();
    }
    return false;
  },

  onEdit: function() {
    this.props.onEdit();
    this.refs.editField.getDOMNode().focus();
  },

  render: function() {
    var classes = Utils.stringifyObjKeys({
      completed: this.props.todo.get('completed'), editing: this.props.editing
    });
    return (
      <li className={classes}>
	  
        <div className="view">
          <input
            className="toggle"
            type="hidden"
            checked={this.props.todo.get('completed')}
            onChange={this.props.onToggle}
            key={this.props.key}
          />
          <label onDoubleClick={this.onEdit}>
            {this.props.todo.get('title')}
          </label>

          <button className="btn" onClick={this.props.onDestroy}>X</button>

        </div>
		/*
        <form onSubmit={this.handleSubmit}>
          <input
            ref="editField"
            className="edit"
            defaultValue={this.props.todo.get('title')}
            onBlur={this.handleSubmit}
            autoFocus="autofocus"
          />
        </form>
		*/
      </li>
    );
  }
});

// An example generic Mixin that you can add to any component that should react
// to changes in a Backbone component. The use cases we've identified thus far
// are for Collections -- since they trigger a change event whenever any of
// their constituent items are changed there's no need to reconcile for regular
// models. One caveat: this relies on getBackboneModels() to always return the
// same model instances throughout the lifecycle of the component. If you're
// using this mixin correctly (it should be near the top of your component
// hierarchy) this should not be an issue.
var BackboneMixin = {
  componentDidMount: function() {
    // Whenever there may be a change in the Backbone data, trigger a reconcile.
    this.getBackboneModels().forEach(function(model) {
      model.on('add change remove', this.forceUpdate.bind(this, null), this);
    }, this);
  },

  componentWillUnmount: function() {
    // Ensure that we clean up any dangling references when the component is
    // destroyed.
    this.getBackboneModels().forEach(function(model) {
      model.off(null, null, this);
    }, this);
  }
};

var TodoApp = React.createClass({
  mixins: [BackboneMixin],
  getInitialState: function() {
    return {editing: null};
  },

  componentDidMount: function() {
    // Additional functionality for todomvc: fetch() the collection on init
    this.props.todos.fetch();
    this.refs.newField.getDOMNode().focus();
  },

  componentDidUpdate: function() {
    // If saving were expensive we'd listen for mutation events on Backbone and
    // do this manually. however, since saving isn't expensive this is an
    // elegant way to keep it reactively up-to-date.
    this.props.todos.forEach(function(todo) {
      todo.save();
    });
  },

  getBackboneModels: function() {
    return [this.props.todos];
  },

  handleSubmit: function(event) {
    event.preventDefault();
    var val = this.refs.newField.getDOMNode().value.trim();
    if (val) {
      this.props.todos.create({
        title: val,
        completed: false,
        order: this.props.todos.nextOrder()
      });
      this.refs.newField.getDOMNode().value = '';
    }
  },
/*
  toggleAll: function(event) {
    var checked = event.nativeEvent.target.checked;
    this.props.todos.forEach(function(todo) {
      todo.set('completed', checked);
    });
  },
*/
  edit: function(todo) {
    this.setState({editing: todo.get('id')});
  },

  save: function(todo, text) {
    todo.set('title', text);
    this.setState({editing: null});
  },

  clearCompleted: function() {
    this.props.todos.completed().forEach(function(todo) {
      todo.destroy();
    });
  },

  render: function() {
    var footer = null;
    var main = null;
    var todoItems = this.props.todos.map(function(todo) {
      return (
        <TodoItem
          key={Math.random()}
          todo={todo}
          onToggle={todo.toggle.bind(todo)}
          onDestroy={todo.destroy.bind(todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.get('id')}
          onSave={this.save.bind(this, todo)}
        />
      );
    }, this);

    if (todoItems.length) {
      main = (
        <section id="main">
          <ul id="todo-list" className="slot">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <section id="todoapp">
          <header id="header">
            <form onSubmit={this.handleSubmit}>
              <input
				type="text"
                ref="newField"
                id="new-todo"
                placeholder="Enter item name"
              />
            </form>
          </header>
          {main}
          {footer}
        </section>
      </div>
    );
  }
});

React.renderComponent(
  <TodoApp todos={new TodoList()} />, document.getElementById('container')
);
