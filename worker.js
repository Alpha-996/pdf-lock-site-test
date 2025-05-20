addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname === '/assets/echapter.pdf') {
    event.respondWith(handlePdfProtection(event.request));
  } else if (url.pathname === '/view-pdf') {
    event.respondWith(handleViewPdf(event.request));
  } else {
    event.respondWith(fetch(event.request));
  }
});

async function handlePdfProtection(request) {
  const token = request.headers.get('X-PDF-Token');
  if (token === 'secret-token') {
    return fetch(request);
  } else {
    return new Response('Unauthorized', { status: 403 });
  }
}

async function handleViewPdf(request) {
  const pdfUrl = 'https://pdf-lock-site-test.pages.dev/assets/echapter.pdf';
  const response = await fetch(pdfUrl, {
    headers: {
      'X-PDF-Token': 'secret-token'
    }
  });
  return new Response(response.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
}
