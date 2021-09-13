from django.views.generic import TemplateView
from typing import Dict, Any

class HomeView(TemplateView):
    template_name = 'home.html'
    
    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        """Gives context data to template.

        Returns:
            Dict[str, Any]: context
        """
        context = super().get_context_data(**kwargs)
        return context
